CREATE EXTENSION pg_cron;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

CREATE OR REPLACE PROCEDURE check_and_update_trip_status()
LANGUAGE plpgsql
as $$
    DECLARE currentTime TIMESTAMP;
    BEGIN
        currentTime := NOW();
        --update trip status to in_progress if starting time has passed
        --update trip status to cancelled if there are no additional passengers
        UPDATE Trip
        SET status = CASE
            WHEN no_of_passengers = 0 AND status = 'planning' THEN 'cancelled'::trip_status
            ELSE 'in_progress'::trip_status
        END
        WHERE currentTime >= Trip.starting_time AND (status = 'planning' OR status = 'locked');
    END
$$;

SELECT cron.schedule('check_trip_status', '*/1 * * * *', 'CALL check_and_update_trip_status()');
SELECT cron.schedule('check_trip_status', '*/1 * * * *', $$SET TIME ZONE 'Europe/Athens'; CALL check_and_update_trip_status()$$);
SELECT * FROM cron.job;

SELECT cron.unschedule('check_trip_status');

UPDATE cron.job SET nodename = '';

select * from cron.job_run_details
order by end_time DESC;

TRUNCATE TABLE cron.job_run_details;

DROP EXTENSION IF EXISTS pg_cron CASCADE;