Criei um diagrama base no draw.io
Instalei o prisma e iniciei ele
Preenchi o schema do prisma formatei usando npx prisma format e fiz a migrate
Fiz o script do seed, instalei o ts-node e executei o script
Instalei o shadcn e adicionei Card e Button
instalei o plugin prettier do tailwind "npm install -D prettier prettier-plugin-tailwindcss"
Criei o arquivo .prettierrc
Instalei -D husky lint-staged
Executei o comando npx husky init
Em pre-commit adicionei os comandos:
npx lint-staged
npx eslint --fix /app
Criei o arquivo .lintstagedrc.json 


//Serve para rodar algum comando antes de cada commit para padronização e organização das linhas de código
//Lint-staged serve para rodar o comando apenas no arquivo que teve mudança