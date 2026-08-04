-- =====================================================
-- MIGRACIÓN 2: TODOS los métodos de pago quedan "Pendiente"
-- hasta que el admin confirme manualmente (incluye efectivo
-- contra-entrega, tarjeta, transferencia y Yape/Plin).
-- Ejecutar DESPUÉS de migracion_pagos_cliente.sql
-- =====================================================

USE GestionPasteleriaDulceAmor;

DROP PROCEDURE IF EXISTS sp_AgregarDetalleVenta;
DELIMITER //
CREATE PROCEDURE sp_AgregarDetalleVenta(
    IN p_id_venta INT,
    IN p_id_postre INT,
    IN p_cantidad INT
)
BEGIN
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_stock INT;

    SELECT precio_actual, stock_total INTO v_precio, v_stock
    FROM Postre WHERE id_postre = p_id_postre;

    IF v_stock < p_cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para el postre seleccionado';
    ELSE
        INSERT INTO Detalle_Venta(id_venta, id_postre, cantidad, precio_unitario)
        VALUES(p_id_venta, p_id_postre, p_cantidad, v_precio);

        UPDATE Postre
        SET stock_total = stock_total - p_cantidad
        WHERE id_postre = p_id_postre;

        -- Antes: se completaba solo si el método NO era Yape/Plin.
        -- Ahora: el pedido SIEMPRE queda 'Pendiente' sin importar el método
        -- (efectivo contra-entrega, tarjeta, transferencia o Yape/Plin).
        -- Solo el admin lo pasa a 'Completada' desde el panel de Pagos.
        UPDATE Venta
        SET monto_total = (SELECT SUM(subtotal) FROM Detalle_Venta WHERE id_venta = p_id_venta),
            estado_venta = 'Pendiente'
        WHERE id_venta = p_id_venta;
    END IF;
END //
DELIMITER ;
