# Inline Capture/Restore

hard	tab
space *in * emphasis {MD037}
space `in ` code {MD038}

<!-- markdownlint-disable -->
hard	tab
space *in * emphasis
space `in ` code
<!-- markdownlint-restore -->

hard	tab
space *in * emphasis {MD037}
space `in ` code {MD038}

<!-- markdownlint-disable no-space-in-emphasis -->

hard	tab
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-disable -->
hard	tab
space *in * emphasis
space `in ` code
<!-- markdownlint-restore -->

hard	tab
space *in * emphasis {MD037}
space `in ` code {MD038}

<!-- markdownlint-disable no-space-in-emphasis -->

hard	tab
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-capture -->
<!-- markdownlint-disable -->
hard	tab
space *in * emphasis
space `in ` code
<!-- markdownlint-restore -->

hard	tab
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-enable no-hard-tabs -->

hard	tab {MD010}
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-restore -->

hard	tab
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-enable no-hard-tabs -->

hard	tab {MD010}
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-capture -->

hard	tab {MD010}
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-restore -->

hard	tab {MD010}
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-enable -->

hard	tab {MD010}
space *in * emphasis {MD037}
space `in ` code {MD038}

<!-- markdownlint-restore -->

hard	tab {MD010}
space *in * emphasis
space `in ` code {MD038}

<!-- markdownlint-disable no-space-in-code -->

hard	tab {MD010}
space *in * emphasis
space `in ` code

<!-- markdownlint-capture --><!-- markdownlint-disable -->
hard	tab
space *in * emphasis
space `in ` code
<!-- markdownlint-restore -->

hard	tab {MD010}
space *in * emphasis
space `in ` code

<!-- markdownlint-disable no-hard-tabs -->

hard	tab
space *in * emphasis
space `in ` code

<!-- markdownlint-restore --> <!-- markdownlint-enable no-space-in-emphasis -->

hard	tab {MD010}
space *in * emphasis {MD037}
space `in ` code
