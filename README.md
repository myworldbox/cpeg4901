# cpeg4901

Author - myworldbox


<a href="https://github.com/myworldbox"><img src="https://myworldbox.github.io/resource/image/portrait/VL_0.jpeg" align="left" height="150" width="150" ></a>


## Machine Learning-based Quantitative Trading Strategies

Python + Tensorflow + Sklearn



## Overview

```bash
My Strategy is to use all of the models from [ sklearn ] to predict the Decision columns.

I have modularized scalers, models, and metrics into arrays to study their collective impacts on the dataset. I have included an additional dataset from yahoo finance and applied the same concept to data with a different shape.

For yahoo finance data, I try to make the problem of trading a binary classification problem.

My models analyze the closing price of the historical market.

If the previous closing price is lower than the current closing price, it is classified as a buying opportunity and vice versa.

To minimize spreads, I only try assets with the top 10 market capitalization.

Only high liquidity markets are being tested.
```