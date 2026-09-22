# Midnight Aerials

Portfólio de filmagens aéreas e drones FPV de Matheus Lucas.

**Site:** https://midnightaerials.com/
**Repositório:** https://github.com/matheus986/SITE

## Publicação

GitHub Pages publica a branch `main`, pasta `/ (root)`, com domínio personalizado e **Enforce HTTPS** ativado. O endereço `www` e o endereço original do GitHub redirecionam para o domínio principal.

O repositório público contém o pacote pronto para hospedagem. Os arquivos na raiz são usados pelo site; as licenças das fontes devem acompanhar a publicação.

## Atualizações

1. Editar os arquivos fonte no projeto local `SITE`, organizado em `assets/` e `scripts/`.
2. Executar `python scripts/validate_site.py`.
3. Gerar o pacote com `python scripts/build_github_export.py`.
4. Conferir com `python scripts/validate_site.py --root dist`.
5. Enviar os arquivos alterados de `dist/` para a raiz da branch `main` pelo GitHub. Preservar `CNAME` e `.nojekyll`. Se um arquivo deixar de existir no pacote, revisar suas referências antes de removê-lo do repositório.
6. Aguardar a publicação em Actions e verificar o site.

`dist/` é gerado novamente a cada execução: não editar seus arquivos manualmente. O showreel publicado usa a versão completa em 720p para respeitar o limite de envio pelo navegador; a versão 1080p está preservada nas fontes locais.

O histórico Git local e o remoto foram iniciados separadamente. O fluxo atual usa o pacote gerado; não enviar a branch local por força nem ativar outro workflow de publicação sem uma migração planejada.

## Domínio e DNS

Registrador: Squarespace. DNS ativo: Cloudflare. Os registros do site usam **Somente DNS**, TTL automático.

| Tipo | Nome | Conteúdo |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | matheus986.github.io |

Os quatro registros A são os destinos do GitHub Pages. Os registros MX, SPF e DKIM atendem ao e-mail; o subdomínio `ha` atende a outro serviço. Eles não são duplicações do site.

## Créditos

Fotos, logotipo e filmagens: Midnight Aerials. Fontes Barlow Condensed e Manrope: licenças OFL incluídas no pacote.
