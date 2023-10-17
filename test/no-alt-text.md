# Images with and without alternate text

![Alternate text](image.jpg)

![](image.jpg) {MD045}

![Alternate text](image.jpg "Title")

![](image.jpg "Title") {MD045}

Image without alternate text ![](image.jpg) in a sentence. {MD045}

Reference image with alternate text ![Alternate text][notitle]

Reference image without alternate text ![][notitle] {MD045}

Reference image with alternate text and title ![Alternate text][title]

Reference image without alternate text and title ![][title] {MD045}

Link to image with alternate text [![Alternate text](image.jpg)](image.jpg)

Link to image without alternate text [![](image.jpg)](image.jpg) {MD045}

Multi-line image with alternate text ![Alternate text](image.jpg "Title"
)

Multi-line image without alternate text ![](image.jpg "Title"
) {MD045:28}

<!-- markdownlint-disable no-inline-html -->

Image tag with alt attribute set to text
<img src="image.png" alt="Descriptive text" />

Image tag with alt attribute not set
<img src="image.png" alt> {MD045}

Image tag with alt attribute set to an empty string
<img src="image.png" alt="" />

Image tag with no alt attribute <img src="image.png" /> {MD045}

Multi-line image tag with no alt text
<img
  src="image.png"> {MD045:45}

Multi-line image tag with alt attribute not set
<img
  src="image.png"
  alt> {MD045:49}

Multi-line image tag with alt text
<img
  src="image.png"
  alt="Description"
  >

Uppercase image tag with alt attribute set
<IMG SRC="cat.png" ALT="Descriptive text">

Uppercase image tag with no alt set <IMG SRC="cat.png" /> {MD045}

<!-- markdownlint-restore no-inline-html -->

[notitle]: image.jpg
[title]: image.jpg "Title"
