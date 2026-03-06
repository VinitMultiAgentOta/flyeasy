-- FlyEasy Flight Portal - SQL Server Schema
-- Run this on your Azure SQL / SQL Server instance

-- Users table
CREATE TABLE Users (
  Id          NVARCHAR(36)  PRIMARY KEY DEFAULT NEWID(),
  Email       NVARCHAR(255) NOT NULL UNIQUE,
  PasswordHash NVARCHAR(255) NOT NULL,
  FirstName   NVARCHAR(100) NOT NULL,
  LastName    NVARCHAR(100) NOT NULL,
  CreatedAt   DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  UpdatedAt   DATETIME2     NOT NULL DEFAULT GETUTCDATE()
);

-- Searches (for analytics and price alerts)
CREATE TABLE Searches (
  Id            NVARCHAR(36)  PRIMARY KEY DEFAULT NEWID(),
  UserId        NVARCHAR(36)  NULL,
  Origin        NVARCHAR(10)  NOT NULL,
  Destination   NVARCHAR(10)  NOT NULL,
  DepartDate    DATE          NOT NULL,
  ReturnDate    DATE          NULL,
  Adults        INT           NOT NULL DEFAULT 1,
  Children      INT           NOT NULL DEFAULT 0,
  Infants       INT           NOT NULL DEFAULT 0,
  CabinClass    NVARCHAR(20)  NOT NULL DEFAULT 'economy',
  TripType      NVARCHAR(20)  NOT NULL DEFAULT 'one_way',
  CreatedAt     DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  CONSTRAINT FK_Searches_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Bookings (one row per PNR)
CREATE TABLE Bookings (
  Id            NVARCHAR(100) PRIMARY KEY,   -- Amadeus bookingId
  PNR           NVARCHAR(20)  NOT NULL UNIQUE,
  OfferId       NVARCHAR(255) NOT NULL,
  UserId        NVARCHAR(36)  NULL,
  ContactEmail  NVARCHAR(255) NOT NULL,
  ContactPhone  NVARCHAR(20)  NOT NULL,
  BookingStatus NVARCHAR(20)  NOT NULL DEFAULT 'CONFIRMED',
  CreatedAt     DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  UpdatedAt     DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  CONSTRAINT FK_Bookings_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Passengers (one row per traveller per booking)
CREATE TABLE Passengers (
  Id          NVARCHAR(36)  PRIMARY KEY DEFAULT NEWID(),
  BookingId   NVARCHAR(100) NOT NULL,
  Name        NVARCHAR(200) NOT NULL,
  DateOfBirth DATE          NULL,
  Nationality NVARCHAR(5)   NULL,
  CreatedAt   DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  CONSTRAINT FK_Passengers_Bookings FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

-- Payments
CREATE TABLE Payments (
  Id                  NVARCHAR(100) PRIMARY KEY,   -- Razorpay orderId
  BookingId           NVARCHAR(100) NOT NULL,
  RazorpayPaymentId   NVARCHAR(100) NULL,
  PaymentMethod       NVARCHAR(20)  NOT NULL DEFAULT 'RAZORPAY',
  PaymentStatus       NVARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  Amount              DECIMAL(12,2) NOT NULL,
  Currency            NVARCHAR(5)   NOT NULL DEFAULT 'INR',
  CreatedAt           DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  UpdatedAt           DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  CONSTRAINT FK_Payments_Bookings FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

-- Tickets (e-ticket records)
CREATE TABLE Tickets (
  Id          NVARCHAR(36)  PRIMARY KEY DEFAULT NEWID(),
  PNR         NVARCHAR(20)  NOT NULL,
  BookingId   NVARCHAR(100) NOT NULL,
  IssuedAt    DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
  EmailSentAt DATETIME2     NULL,
  CONSTRAINT FK_Tickets_Bookings FOREIGN KEY (BookingId) REFERENCES Bookings(Id),
  CONSTRAINT FK_Tickets_PNR FOREIGN KEY (PNR) REFERENCES Bookings(PNR)
);

-- Indexes for common queries
CREATE INDEX IX_Bookings_PNR ON Bookings(PNR);
CREATE INDEX IX_Bookings_ContactEmail ON Bookings(ContactEmail);
CREATE INDEX IX_Payments_BookingId ON Payments(BookingId);
CREATE INDEX IX_Passengers_BookingId ON Passengers(BookingId);
CREATE INDEX IX_Searches_Origin_Dest ON Searches(Origin, Destination, DepartDate);
