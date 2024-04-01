select * from app_user;
select *
from trip;


ALTER SEQUENCE trip_trip_id_seq RESTART WITH 1;
ALTER SEQUENCE chat_chat_id_seq RESTART WITH 1;

ALTER TABLE trip ADD COLUMN trip_creator_id INT NOT NULL ;

--delete all tables

delete from trip;
delete from chat;
delete from chat_participants;
delete from trip_passengers;
delete from trip_stops;