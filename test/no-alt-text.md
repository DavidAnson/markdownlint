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

Image tag with alt attribute set to text
<img src="image.png" alt="Descriptive text"> {MD033}

Image tag with alt attribute not set
<img src="image.png" alt> {MD045} {MD033}

Image tag with alt attribute set to an empty string
<img src="image.png" alt=""> {MD033}

Image tag with no alt attribute
<img src="image.png"> {MD045} {MD033}

Multi-line image tag with no alt text
<img
  src="image.png"> {MD045:44} {MD033:44}

Multi-line image tag with alt attribute not set
<img
  alt
  src="image.png"> {MD045:48} {MD033:48}

[notitle]: image.jpg
[title]: image.jpg "Title"
