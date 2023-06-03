---
title: Python-Image-API
thumbnail: /gallery/thumbnails/Lenna.png
date: 2022-04-01 16:52:23
categories:
    - DigitalImageProcessing
    - Image API
tags: [DIP, Image, API]
---

> 本文主要对 python 常用的几个 `图像处理库` 进行简单的对比分析，并对常用的函数及其参数进行总结。包括 `opencv, pillow, matplotlib, skimage`。
<!-- more -->

# Contents
---
- **[opencv](#opencv)**
- **[pillow](#pillow)**
- **[matplotlib](#matplotlib)**
- **[skimage](#skimage)**
- **[convert](#convert)**
- **[conclusion](#conclusion)**
- **[reference](#reference)**

# opencv
---
OpenCV (Open Source Computer Vision Library) 通道顺序为 `BGR`，可以转换为 RGB：`img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)` ;  
`img`: numpy.ndarray；`img.shape`: (H,W,C)；`img.size`: 图像的像素点数；`img.dtype`: 图像的数据类型(uint8)。

## 安装
```shell
pip install opencv-python
```

## 使用
```python
import cv2

# Basic read and show
img = cv2.imread(filename[, flags])  # [H,W,C] [0-255] uint8 [BGR]
img = cv2.resize(src, dsize[, dst[, fx[, fy[, interpolation]]]])  # [W,H]
img = cv2.cvtColor(src, code[, dst[, dstCn]])  # img[:, :, ::-1]
cv2.imshow(winname, mat)  # [0-255] [H,W] or [H,W,C] [BGR]
cv2.imwrite(filename, img[, params])
cv2.waitKey()
cv2.destroyAllWindows()

# Channel split and merge
b,g,r = cv2.split(img)
merge_img = cv2.merge((b,g,r))

# RoI
roi = img[100:300, 30:350, :]

# Rotate
matrix = cv2.getRotationMatrix2D((w / 2, h / 2), 45, 1) # (center point, angle, size)
image = cv2.warpAffine(image, matrix, (w, h), flags=cv2.INTER_LINEAR, 
                       borderMode=cv2.BORDER_CONSTANT, borderValue=[255, 255, 255])

# Flip
image = cv2.flip(src, flipCode[, dst])  # 1:horizontally, 0:vertically, -1:h&v

# Bulr
median_Blur = cv2.medianBlur(noise_img, 3)
mean_Blur = cv2.blur(noise_img, (3, 3))
gaussian_Blur = cv2.GaussianBlur(noise_img, (3, 3), 0)

# Crop padding
cv2.copyMakeBorder(src, top, bottom, left, right, borderType=cv2.BORDER_CONSTANT, value=[255, 255, 255])

# HistEqualize
dst = cv2.equalizeHist(img)
plt.hist(dst.ravel(), 256, [0, 256], color='r')

# bite ops
dst=cv2.bitwise_and(src1, src2[, dst[, mask]])
dst=cv2.bitwise_not(src[, dst[, mask]])
```

# pillow
---
PIL(Python Imaging Library) 通道顺序为 `RGB`，PIL 读取图片获得的不是矩阵，而是 `Image` 格式，可以利用 numpy 进行转化。  
`img.format`: 图像格式；`img.mode`: 图像类型(L, RGB, RGBA)；`img.size`: (W, H)。

## 安装
```shell
pip install pillow
```

## 使用
```python
from PIL import Image
import numpy as np

# Basic read and show
img = Image.open(fp, mode='r', formats=None)
print(type(img), img.size, img.mode, img.format)  # Image [W,H] [RGB] PNG
img = img.convert(mode=None, matrix=None, dither=None, palette=Palette.WEB, colors=256)  # '1', 'L', 'RGB'
img = img.resize(size, resample=None, box=None, reducing_gap=None)  # [W,H]
img.show(title=None)  # Image [W,H] [RGB]
img_arr = np.array(img)  # [H,W,C] [0-255] uint8 [RGB]
img = Image.fromarray(img_arr)  # Image [W,H]
img.save(fp, format=None, **params)

# Channel split and merge
r,g,b = img.split()
img = Image.merge('RGB', (r,g,b))
# RoI
roi = img.crop(box=None)  # box=(left, upper, right, lower)
# Rotate
img = img.rotate(angle, resample=Resampling.NEAREST, expand=0, 
    	     center=None, translate=None, fillcolor=None)
# Flip
img = img.transpose(Image.FLIP_TOP_BOTTOM)  # Vertically
img = img.transpose(Image.FLIP_LEFT_RIGHT)  # Horizontally

# Filter
from PIL import ImageFilter
img_blur = img.filter(ImageFilter.BLUR)
img_contour = img.filter(ImageFilter.CONTOUR)
img_detail = img.filter(ImageFilter.DETAIL)
img_edge_enhance = img.filter(ImageFilter.EDGE_ENHANCE)
img_sharp = img.filter(ImageFilter.SHARPEN)
img_gauss = img.filter(ImageFilter.GaussianBlur(radius=2))

# Enhance
from PIL import ImageEnhance
img_bright = ImageEnhance.Brightness(img)
brightness = 3
image_brighted = img_bright.enhance(brightness)

img_color = ImageEnhance.Color(img)
color = 2
image_colored = img_color.enhance(color)

img_contrast = ImageEnhance.Contrast(img)
contrast = 3
image_contrasted = img_contrast.enhance(contrast)

img_sharp = ImageEnhance.Sharpness(img)
sharpness = 2
image_sharped = img_sharp.enhance(sharpness)
```

# matplotlib
---
matplotlib 通道顺序为 `RGB`，`img`: numpy.ndarray；主要用于描绘 `结果曲线` 或 `多图显示`，图像处理操作大多仍采取 opencv 实现；

## 安装
```shell
pip install matplotlib
```

## 使用
```python
import matplotlib.pyplot as plt

# Basic read and show
img  = plt.imread(fname, format=None)  # [0-255] uint8 [RGB] [HWC]
plt.imshow(X, cmap=None, *args, **kwargs)  # XLarray-like or PIL image
plt.axis('off')
plt.show()
plt.savefig(fname, *args, **kwargs)

# Channel split
(r, g, b) = [img[:,:,i] for i in range(3)]

# Figures plot
plt.plot([x], y, [fmt], *, data=None, **kwargs)
plt.plot([x], y, [fmt], [x2], y2, [fmt2], ..., **kwargs)

# Result list to img [e.g.]
fig = plt.figure()
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.plot(range(0, epoch + 1), train_loss, 'ob--', label='train loss')
plt.plot(range(0, epoch + 1), val_loss, 'or-', label='val loss')
plt.legend()
# plt.show()
plt.savefig(fig_name)

# Multiple figures [e.g.]
from skimage import data
import matplotlib.pyplot as plt
img=data.astronaut()  # [0-255] [W,H,C] uint8
plt.figure(num='astronaut',figsize=(8,8))  # Create a new figure.

plt.subplot(2, 2, 1)  # plot 2x2=4 figures, and specify 1st figure.
plt.title('origin image')
plt.imshow(img)

plt.subplot(2, 2, 2)
plt.title('R channel')
plt.imshow(img[:,:,0], plt.cm.gray)
plt.axis('off')

plt.subplot(2, 2, 3)
plt.title('G channel')
plt.imshow(img[:,:,1], plt.cm.gray)
plt.axis('off')

plt.subplot(2, 2, 4)
plt.title('B channel')
plt.imshow(img[:,:,2], plt.cm.gray)
plt.axis('off')

plt.show()
```

# skimage
---
skimage(scikit-image) 通道顺序为 `RGB`，`img`: numpy.ndarray；

## 安装
```shell
pip install scikit-image
```

## 使用
```python
from skimage import io

# Basic read and show
img = io.imread(fname, as_gray=False, plugin=None, **plugin_args)  # [0-255] uint8 [RGB] [HWC]
img = color.rgb2grey(img)
io.imshow(img)
io.show() 
io.imsave(fname, arr, plugin=None, check_contrast=True, **plugin_args)

from skimage import transform
# Resize
img_resize = transform.resize(img, (H,W))
# Rescale
img_r1 = transform.rescale(img, 0.1)
img_r2 = transform.rescale(img, [0.5,0.2])
# Rotate
img_90 = transform.rotate(img, 90)
img_30 = transform.rotate(img, 30, resize=True)

# Filter
from skimage import filters, feature, disk
edges = filters.sobel(img)
edges = filters.roberts(img)
edges1 = feature.canny(img)  # sigma=1
edges2 = feature.canny(img, sigma=3)
filt_real, filt_fake = fileters.gabor_filter(img, frequency=0.4)
edges = filters.gaussian(img, sigma=0.4)
edges = filters.median(img, disk(5))
```

# convert
---
```python
# opencv -> pil
img_pil = Image.fromarray(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
# pil -> opencv
img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

# skimage -> pil
img_pil = Image.fromarray(img_skimage)
# pil -> skimage
img_sk = np.array(img_skimage)

# opencv -> skimage
img_skimage = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
# skimage -> opencv
img_cv = cv2.cvtColor(img_skimage, cv2.COLOR_RBG2BGR)

# Transpose
img = img.transpose(2, 0, 1)  # [H,W,C] to [C,H,W]
```

# conclusion
---
| Name | Type | Shape / Size | Channel |
|:--------|:--------:|:--------:|:--------:|
| opencv | numpy.ndarray | Shape: [H,W,C] | BGR
| pillow | PIL.Image | Size: [W,H] | RGB
| matplotlib | numpy.ndarray | Shape: [H,W,C] | RGB
| skimage | numpy.ndarray | Shape: [H,W,C] | RGB

# reference
---
> [1] [Python的图像库（Opencv、PIL、matplotlib、skimage）的使用](https://blog.csdn.net/qq_36941368/article/details/82998296?spm=1001.2101.3001.6650.8&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-8.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-8.pc_relevant_default&utm_relevant_index=13).  
> [2] [torchvision 的 transforms 与 python 的图像接口opencv、skimage和PIL 相关总结](https://blog.csdn.net/weixin_38208912/article/details/90297267).  
> [3] [opencv-3.4](https://docs.opencv.org/3.4/index.html).  
> [4] [pillow-stable](https://pillow.readthedocs.io/en/stable/index.html).  
> [5] [matplotlib-stable](https://matplotlib.org/stable/api/).  
> [6] [scikit-image-stable](https://scikit-image.org/docs/stable/).