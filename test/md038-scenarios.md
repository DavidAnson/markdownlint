# MD038 Scenarios

## Allowed: No space

`code`

## Allowed: Padding, no backtick

` code `

## Allowed: Padding, backtick

`` `code` ``

## Allowed: Start or end, backtick

``code` ``

`` `code``

## Reported: Start or end, no backtick

`code  ` {MD038}

`code` (fixed)

`  code` {MD038}

`code` (fixed)

## Reported: Start or end, backtick

``code`  `` {MD038}

``code` `` (fixed)

``  `code`` {MD038}

`` `code`` (fixed)

## Reported: Start and end, no backtick

`  code  ` {MD038}

`code` (fixed)

## Reported: Start and end, backtick

``  code`  `` {MD038}

`` code` `` (fixed)

``  `code  `` {MD038}

`` `code `` (fixed)

``  `code`  `` {MD038}

`` `code` `` (fixed)
