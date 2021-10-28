const express = require('express');
let app = express();
let PORT = 1234;

const config = require('./config.js'); // Name: github_token
const axios = require('axios');

let qa = require('./routes/qa')

app.use(express.static('client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/product/info/*', async (req, res) => {
  // console.log(req.params);
  // {'0': '60221'}
  const productId = req.params['0']; // string not number

  const optionsRelatedproduct = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${productId}/related`,
    headers: { Authorization: config.github_token }
  }

  const relatedProductRequest = axios(optionsRelatedproduct);

  const optionsReview = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews?product_id=${productId}&count=100`,
    headers: { Authorization: config.github_token }
  }
  const reviewRequest = axios(optionsReview);

  const optionsStars = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/meta?product_id=${productId}`,
    headers: { Authorization: config.github_token }
  }

  const starsRequest = axios(optionsStars)


  try {
    let relatedProduct = await relatedProductRequest;
    let review = await reviewRequest;
    let reviewStars = await starsRequest;

    res.send({
      related: relatedProduct.data,
      review: review.data,
      reviewStars: reviewStars.data
    })
  } catch(err){
    res.send(err);
  }


})

/***** Question and Answer *****/
app.use('/qa', qa);

app.use(express.static('client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => console.log(`Listen on port ${PORT}`))