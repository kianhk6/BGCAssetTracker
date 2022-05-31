Create table Locations(
                          location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                          location_name varchar(100) UNIQUE
);
Insert into Locations (location_name)  values ('Victoria');
Insert into Locations (location_name)  values ('Kamloops');
Insert into Locations (location_name)  values ('Calgary');
Insert into Locations (location_name)  values ('Edmonton');
Insert into Locations (location_name)  values ('Toronto');
Insert into Locations (location_name)  values ('Ottawa');
Insert into Locations (location_name)  values ('Halifax');
Insert into Locations (location_name)  values ('Vancouver');



Create table Equipments(
                           database_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                           barcode_id varchar(100) UNIQUE, serial_number varchar(100) UNIQUE,  equipment_type
                                       varchar(100), category varchar(100), project varchar(100),
                           equipment_status varchar(100)
);
Alter table equipments add column equipment_group varchar(100);
Alter table equipments add column borrower varchar(100);
Alter table equipments add foreign key (borrower) references users(user_email);
Alter table equipments add column equipment_location varchar(100);
Alter table equipments add foreign key (equipment_location) references locations(location_name);

Insert into equipments (barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, borrower, equipment_location) values ('2', '2', 'type_2', 'cat_2', 'proj_2', 'b', 'group2', 'bobq1@gmail.com', 'Vancouver');
INSERT INTO users (user_name, user_email, user_password) VALUES ('empty', 'No Borrower', 'dont login');



Create table History(
                        intial_date varchar(100),
                        end_date varchar(100),
                        event_status varchar(100)
);
Alter table History add column borrower varchar(100);
Alter table History add foreign key (borrower) references users(user_email);

Alter table History add column equipment varchar(100);
Alter table History add foreign key (equipment) references Equipments(barcode_id);

Alter table equipments add column requestedBy varchar(100);
ALTER TABLE History RENAME COLUMN equipment TO equipment_barcode;
Alter table History add column equipment_type varchar(100);
Alter table History add column present_date varchar(100);
Alter table History add column end_date_compare_with_present varchar(100);

Alter table users Set user_email = 'noborrower@email.com' where user_email = 'No Borrower'
--psql -U postgres 
--\c bgc --> connecting 
--\dt
--heroku pg:psql --> needs create table