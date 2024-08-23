CREATE DATABASE telephone_directory;
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phoneNumbers TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    emails TEXT NOT NULL
);

