-- =====================================================================
-- Belloni Motors — Promover usuário a admin
-- Substitua o email abaixo pelo email do Sr. Belloni e rode.
-- =====================================================================
update public.profiles
  set role = 'admin'
  where id = (
    select id from auth.users where email = 'bellonima10@gmail.com'
  );
