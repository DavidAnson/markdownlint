# inline_html-allowed_elements

<h1>This is allowed.</h1>

<h2>This is not allowed. {MD033}</h2>

<h3>This is allowed.</h3>

<h1>This <h2>is not</h2> allowed. {MD033}</h1>

<h3>This <h2>is not</h2> allowed. {MD033}</h3>

<hr>

<hr/>

<br> {MD033}

<br > {MD033}

<br/> {MD033}

<br /> {MD033}

<br attribute/> {MD033}

<br attribute /> {MD033}

<br attribute="value"/> {MD033}

<br attribute="value" /> {MD033}

<p>
This is allowed.
</p>

<article> {MD033}
This is not allowed.
</article>

<p>
<article> {MD033}
This is not allowed.
</article>
<hr/>
<br/> {MD033}
</p>

<P>
<Article> {MD033}
This is not allowed.
</Article>
<Hr/>
<Br/> {MD033}
</P>
