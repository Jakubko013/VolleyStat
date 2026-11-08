-- Volejbal Statistika: pomocné funkce pro RLS přesunuté do schématu `private`, které Supabase nevystavuje přes API.
-- Pravidla RLS je dál používají (odkazují na funkci, ne na její název), jen je nejde volat přes /rest/v1/rpc.
-- ensure_club() zůstává v public: aplikace ji volá schválně při přihlášení (vrací jen klub volajícího).

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter function public.my_club_id() set schema private;
alter function public.is_club_admin() set schema private;
alter function public.club_can_write(uuid) set schema private;
alter function public.club_can_save_match(uuid, text) set schema private;
