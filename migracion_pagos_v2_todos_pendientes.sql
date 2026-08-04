-- =====================================================
-- MIGRACIÓN v2: TODOS los métodos de pago quedan
-- "Pendiente" hasta que el admin confirme manualmente
-- (antes solo Yape/Plin se quedaba pendiente; Efectivo,
-- Tarjeta y Transferencia se autocompletaban).
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

        -- Ya NO se fuerza 'Completada' para ningún método de pago.
        -- El pedido se crea como 'Pendiente' (default de sp_RegistrarVenta)
        -- y se queda así hasta que el admin le dé "Confirmar pago" en el
        -- módulo de Pedidos y Pagos, sea Yape/Plin, Efectivo (contra
        -- entrega), Tarjeta o Transferencia.
        UPDATE Venta
        SET monto_total = (SELECT SUM(subtotal) FROM Detalle_Venta WHERE id_venta = p_id_venta)
        WHERE id_venta = p_id_venta;
    END IF;
END //
DELIMITER ;
