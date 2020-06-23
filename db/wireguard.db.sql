BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "client" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"name"	TEXT,
	"pkey"	TEXT,
	"prekey"	TEXT,
	"allowip"	TEXT,
	"allowipc"	TEXT
);
CREATE TABLE IF NOT EXISTS "server" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"interface"	TEXT,
	"ip"	TEXT,
	"port"	INTEGER,
	"pkey"	TEXT
);
COMMIT;