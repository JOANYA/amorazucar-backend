-- =====================================================
-- SCRIPT ÚNICO Y AUTOCONTENIDO — Pastelería "Dulce Amor"
-- Ejecuta ESTO COMPLETO, de una sola vez, en una sesión
-- NUEVA de tu cliente MySQL (no reutilices la ventana
-- donde antes hiciste USE gestioncitasfarmacia).
-- =====================================================

-- Fuerza la base correcta, sin importar qué base estaba
-- activa antes en tu sesión.
USE GestionPasteleriaDulceAmor;

-- 1) Columna para la foto del comprobante de Yape/Plin
--    (si ya existe, este bloque simplemente no hace nada)
SET @existe_columna := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE table_schema = 'GestionPasteleriaDulceAmor'
    AND table_name = 'Venta'
    AND column_name = 'comprobante_pago'
);

SET @sql_alter := IF(
  @existe_columna = 0,
  'ALTER TABLE Venta ADD COLUMN comprobante_pago VARCHAR(255) NULL AFTER metodo_pago',
  'SELECT "comprobante_pago ya existía, no se tocó nada" AS resultado'
);

PREPARE stmt FROM @sql_alter;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) Procedimiento actualizado: ningún método de pago se
--    autocompleta. Todo pedido queda 'Pendiente' hasta que
--    el admin confirme el pago manualmente.
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

        UPDATE Venta
        SET monto_total = (SELECT SUM(subtotal) FROM Detalle_Venta WHERE id_venta = p_id_venta)
        WHERE id_venta = p_id_venta;
    END IF;
END //
DELIMITER ;

-- 3) Rol 'cliente' (por si tampoco llegó a aplicarse antes)
UPDATE Usuario SET rol = 'admin' WHERE rol = 'vendedor';
ALTER TABLE Usuario MODIFY rol ENUM('admin', 'pastelero', 'cliente') NOT NULL;

-- 4) Verificación final: esto DEBE devolver una fila.
--    Si sale vacío, todavía no estás en la base correcta.
SELECT TABLE_SCHEMA, COLUMN_NAME, COLUMN_TYPE
FROM information_schema.COLUMNS
WHERE table_schema = 'GestionPasteleriaDulceAmor'
  AND table_name = 'Venta'
  AND column_name = 'comprobante_pago';
