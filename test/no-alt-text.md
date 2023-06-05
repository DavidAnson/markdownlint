# Images with and without alternate text

![Alternate text](image.jpg)

![](image.jpg) {MD045}

![Alternate text](image.jpg "Title")

![](image.jpg "Title") {MD045}

Image without alternate text ![](image.jpg) in a sentence. {MD045}

Reference image with alternate text ![Alternate text][notitle] {MD054}

Reference image without alternate text ![][notitle] {MD045} {MD054}

Reference image with alternate text and title ![Alternate text][title] {MD054}

Reference image without alternate text and title ![][title] {MD045} {MD054}

Link to image with alternate text [![Alternate text](image.jpg)](image.jpg)

Link to image without alternate text [![](image.jpg)](image.jpg) {MD045}

[notitle]: image.jpg
[title]: image.jpg "Title"
