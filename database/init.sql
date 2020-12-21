--------------------------------------------------------
-- Initiele inrichting
--------------------------------------------------------

-- Check database master key
USE master;
GO
SELECT *
FROM sys.symmetric_keys
WHERE name = '##MS_ServiceMasterKey##';
GO

-- Create database Key
USE Infostore;
GO
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'sa';
GO

CREATE ASYMMETRIC KEY Gebruiker1
WITH ALGORITHM = RSA_2048 ---->Take a look in this type of algorithms
ENCRYPTION BY PASSWORD = 'sa'
GO


CREATE ASYMMETRIC KEY Gebruiker2
WITH ALGORITHM = RSA_2048 ---->Take a look in this type of algorithms
GO

DROP ASYMMETRIC KEY Gebruiker1
