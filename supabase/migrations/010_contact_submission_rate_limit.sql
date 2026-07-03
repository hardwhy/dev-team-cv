-- Rate-limit public contact form submissions to reduce spam/abuse.

create index if not exists contact_submissions_email_created_at_idx
  on contact_submissions (lower(email), created_at desc);

create or replace function enforce_contact_submission_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  hourly_count integer;
  daily_count integer;
begin
  new.name := left(trim(new.name), 100);
  new.email := left(lower(trim(new.email)), 254);
  new.message := left(trim(new.message), 5000);

  if length(new.name) < 2 then
    raise exception 'Name is too short.';
  end if;

  if length(new.message) < 10 then
    raise exception 'Message is too short.';
  end if;

  if exists (
    select 1
    from contact_submissions
    where lower(email) = new.email
      and message = new.message
      and created_at > now() - interval '24 hours'
  ) then
    raise exception 'This message was already sent recently. Please wait before sending it again.';
  end if;

  select count(*) into hourly_count
  from contact_submissions
  where lower(email) = new.email
    and created_at > now() - interval '1 hour';

  if hourly_count >= 3 then
    raise exception 'Too many messages from this email. Please try again in an hour.';
  end if;

  select count(*) into daily_count
  from contact_submissions
  where lower(email) = new.email
    and created_at > now() - interval '24 hours';

  if daily_count >= 10 then
    raise exception 'Daily message limit reached for this email. Please try again tomorrow.';
  end if;

  return new;
end;
$$;

drop trigger if exists contact_submission_rate_limit on contact_submissions;

create trigger contact_submission_rate_limit
  before insert on contact_submissions
  for each row
  execute procedure enforce_contact_submission_limits();
