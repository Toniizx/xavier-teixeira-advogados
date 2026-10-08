# Publicar no domínio oficial (xavierteixeiraadvogados.com)

Hoje o site está em **prévia** no GitHub Pages:
https://toniizx.github.io/xavier-teixeira-advogados/

Enquanto estiver em prévia, as páginas têm `noindex` para o Google **não** indexar
esta cópia (o site antigo continua no ar no domínio oficial).

## Passo a passo na hora de trocar

1. **Remover o `noindex`** — apagar esta linha (e o comentário acima dela) em
   `index.html`, `politica-de-privacidade.html` e `termos-de-uso.html`:
   ```html
   <meta name="robots" content="noindex, nofollow">
   ```
   (o `404.html` deve **continuar** com `noindex`).

2. **Trocar o endereço da prévia pelo domínio** no `index.html`:
   substituir `https://toniizx.github.io/xavier-teixeira-advogados/`
   por `https://xavierteixeiraadvogados.com/` (aparece em `og:url`, `og:image` e `twitter:image`).

3. **Domínio no GitHub Pages**: em *Settings → Pages → Custom domain*, informar
   `xavierteixeiraadvogados.com` e marcar *Enforce HTTPS*.

4. **DNS (no registro do domínio)**:
   - Registros `A` do domínio raiz apontando para:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Registro `CNAME` de `www` apontando para `toniizx.github.io`

5. **Redirecionar links antigos** do WordPress que estejam no Google
   (ex.: `/politica-de-privacidade/`, `/blog/`) — avaliar se o blog (Artigos) vai continuar.

6. **Google Search Console**: adicionar a propriedade do domínio e enviar
   `https://xavierteixeiraadvogados.com/sitemap.xml`.

7. **Testar a prévia de compartilhamento** colando o link em
   https://developers.facebook.com/tools/debug/ (atualiza o cache do WhatsApp/Facebook).

8. **Validar os dados estruturados** em https://search.google.com/test/rich-results
