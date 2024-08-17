# viva-sabor-api
<p align="center">
  <a href="https://github.com/rabispedro/" target="blank"><img src="https://avatars.githubusercontent.com/u/42853022?s=400&u=2d70e35dd2908adbb6f84cdb13350155169be00f&v=4" width="200" alt="Viva Sabor logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Descrição

API monolítica Viva Sabor para a plataforma de gastronomia do desafio Grão Direto.

## Requisitos

- Autenticação por email e senha;
- API REST;
- Repositório de dados com `usuários`, `restaurantes` e `itens do cardápio`;

## Recursos Disponíveis:

Esta API disponibiliza vários recursos, listados a seguir, além da previsão de inclusão de melhorias e sistemas novos.

- App
  - Checagem simples de saúde da aplicação;
- Endereço
  - Cadastro de endereço vinculado ao usuário cliente;
  - Cadastro de endereço vinculado ao restaurante;
  - Cadastro de endereço vinculado ao restaurante;
- Cargo
  - Cadastro de endereço vinculado ao usuário cliente;
  - Cadastro de endereço vinculado ao restaurante;
- Autenticação
  - Login com email e senha;
  - JWT com informações de sessão;
- Pedido
  - Cadastro de pedido de um cliente em um restaurante;
  - Visualização de pedidos de um cliente;
  - Visualização de pedidos de um restaurante;
- Usuário
  - Cadastro de cliente novo;
  - Cadastro de cliente novo;
- Restaurante
  - aaa

## Instalação

Para instalar os pacotes necessários deste projeto, é importante ter algum gerenciador de pacotes NodeJS.

### NPM

Caso esteja usando o NPM, rode os comandos abaixo:

```bash
$ npm install
```

### Yarn

Caso deseje usar o Yarn, certifique-se que o mesmo esteja instalado em sua máquina ou utilize o NPX para executá-lo.

```bash
# Instalar Yarn localmente
$ sudo npm i -g yarn
$ yarn install

# Executando via NPX
$ npx yarn install
```

## Iniciando o servidor

Para inicializar corretamente a aplicação, é necessário subir os serviços do `docker-compose.yaml` antes.

Além disso, também é preciso configurar o arquivo `.env` de acordo com o `.env.template`.

Segue abaixo os comandos para inicializar o servidor:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Observações

- Para utilizar corretamente o MINIO é necessário entrar no painel de administração e criar novas _access_key_, no caso `http://localhost:9001/access-keys`

## Testes

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
