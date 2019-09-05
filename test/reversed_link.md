Go to (this website)[https://www.example.com] {MD011} {MD034}

However, this shouldn't trigger inside code blocks:

    myObj.getFiles("test")[0]

Nor inline code: `myobj.getFiles("test")[0]`

Two (issues)[https://www.example.com/one] in {MD011} {MD034}
the (same text)[https://www.example.com/two]. {MD011} {MD034}

<!-- markdownlint-disable line-length -->
Two (issues)[https://www.example.com/three] on the (same line)[https://www.example.com/four]. {MD011} {MD034}
