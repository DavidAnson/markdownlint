# ignore-comments.md

Hard	tab {MD010}

Hard	tabs		hard			tabs {MD010}

<!-- Hard	tab -->

<!--Hard	tab-->

<!--
Hard	tab
-->

<!--
Hard	tab

Hard	tab
-->

Text <!--
Hard	tab {MD010}
Invalid--!>comment
Hard	tab {MD010}
--> text

Te<!-- Hard	tab -->xt

Te<!-- Hard	tab -->xt {MD009} 

T<!-- Hard	tab -->ex<!-- Hard	tab -->t

Te<!--
Hard	tab
-->xt

Te<!--
Hard	tab
-->xt {MD009} 

Te<!-- Trailing space 
-->xt

<!-- markdownlint-disable MD010 -->

Hard	tab
