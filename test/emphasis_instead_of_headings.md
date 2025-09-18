# emphasis_instead_of_headings

**Section 1: the first section {MD036}**

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
in culpa qui officia deserunt mollit anim id est laborum.

__Section 1.1: another section {MD036} {MD050}__

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
in culpa qui officia deserunt mollit anim id est laborum.

*Section 2: yet more sections {MD036}*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
in culpa qui officia deserunt mollit anim id est laborum.

_Section 3: oh no more sections {MD036} {MD049}_

This is a normal paragraph
**that just happens to have emphasized text in**
even though the emphasized text is on its own line.

This is another **normal** paragraph with some text in it. This also should
not trigger the rule.

**This is an entire paragraph that has been emphasized, and shouldn't be
detected as a heading because it's on multiple lines**

**This also shouldn't be detected as a heading as it ends in punctuation.**

**This shouldn't be detected as a heading as it ends in full-width punctuation。**

**[This as well since it is a link](https://example.com)**

*Section 4: emphasis as heading {MD036}* <!-- comment -->

Emphasis as heading followed by an HTML comment

<!-- comment --> __Section 5: emphasis as heading {MD036}__

Emphasis as heading following an HTML comment

*Section 6: emphasis <!-- comment --> as non-heading*

Embedded HTML comments are unusual and cause the emphasis to be ignored/allowed
