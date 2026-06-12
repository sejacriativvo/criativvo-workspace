-- Promove um usuário a ADMIN (Sr. Gilson).
-- Rode DEPOIS de criar o usuário em Authentication > Users.
-- Troque o e-mail abaixo pelo e-mail que você cadastrou.

update public.profiles p
set role = 'admin',
    name = 'Italo Pereira',
    initials = 'IP'
from auth.users u
where u.id = p.id
  and u.email = 'italoaugustoantunespereira@gmail.com';

-- Conferir:
select p.role, p.name, u.email
from public.profiles p
join auth.users u on u.id = p.id;
