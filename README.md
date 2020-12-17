# M3 - Second Chance



## Description 

![Screenshot 2020-12-17 at 10.44.51](/Users/julianehuber/Desktop/Screenshot 2020-12-17 at 10.44.51.png)

This is an app for bloggers/offline second hand shops to open an online shop for their clothing and on the other hand for people interested in buying second hand clothing. 

## User Stories

Signup: As an anon I can sign up in the platform so that I can start playing into competition

Login: As a user I can login to the platform so that I can play competitions

Logout: As a user I can logout from the platform so no one else can use it

Add Products: As a shopowner I can upload new products on the plattform 

Edit Products: As a shopowner I can edit products

Delete Products: As a shopowner I can delete products

Open shop: As a user I can open a shop 

Delete shop: As a user I can delete a shop

View Products: I can view products 

User Profile: I can view my profile

Shop Profile: I can view the different shops

## Backlog

- Add to Cart Functionality 
- Payment & co. 



| Path                | Component       | Permission              | Behavior                                                  |
| ------------------- | --------------- | ----------------------- | --------------------------------------------------------- |
| "/"                 | SplashScreen    | public <Route>          |                                                           |
| '/signup'           | Signup          | <AnonRoute>             | Signup, link to Login, returns to the Homepage afterwards |
| '/login'            | Login           | <AnonRoute>             | Login, link to Signup, returns to the Signup afterwards   |
| '/products'         | ProductListPage | useronly <PrivateRoute> | Shows the Products                                        |
| '/products/add'     | ProductListPage | useronly <PrivateRoute> | Add Products                                              |
| '/products/:id'     | ProductListPage | useronly <PrivateRoute> |                                                           |
| '/account'          | AccountPage     | useronly <PrivateRoute> | AccountPage with all the information                      |
| '/open-shop'        | ShopListPage    | useronly <PrivateRoute> | Add Shop                                                  |
| '/add-product'      | Product         | public <Route>          |                                                           |
| '/edit-product/:id' | Edit Product    | public <Route>          |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |
|                     |                 |                         |                                                           |

## Components

- AddProduct
- Category
- EditProduct
- EditProfile
- EditShop
- Header
- ListPage
- Navbar
- NewIn
- ProductCard
- Searchbar
- SearchResult
- SearchResults
- ShopList
- SimilarProducts
- SplashScreen
- SuccessfulUpload
- Teaser



## Services

- Auth Service 
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser()



## Server Backend

User

```
{username: {type: String, required: true, unique: true},
  email: String,
  password:{type: String, required:true},
  firstName: {type: String},
  lastName: {type: String}, 
  image: {type: String, default:""},
  bio: {type: String, maxLength: 280},
  birthday: {type: Date},
  gender: {type:String, enum: ["women", "men"]},
  shippingAddress: [{type: Schema.Types.ObjectId, ref:"Address"}], 
  favoriteProducts: [{type: Schema.Types.ObjectId, ref:"Product"}],
  reviews: [{type: Schema.Types.ObjectId, ref:"Review"}],
  orders:  [{type: Schema.Types.ObjectId, ref:"Order"}],
  shopOwner: {type: Boolean, default: false},
  shop:{type: Schema.Types.ObjectId, ref:"Shop"},
  newsletter: {type:Boolean}, 
}
```

Shop

```
{
    shopName: {type: String, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    phoneNumber: {type: String},
    description: {type: String, maxLength: 280}, 
    instagramAccount: {type: String},
    facebookAccount: {type: String},
    typeOfShop: String,
    address: {type:String},
    zipCode:{type:String},
    city:{type:String},
    country: {type: String},
    backgrdoundImage: {type: String, default: ""},
    worldwideShipping: {type: Boolean, default: true},   
    image: {type: String, default: ""},
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    owner:  {type: Schema.Types.ObjectId, ref:"User"},
    products: [{type: Schema.Types.ObjectId, ref:"Product"}]
  }
```

Product

```
{
    brand: {type: String, required: true},
    description: {type: String, maxLength: 280, required: true},
    price: {type: Number},
    listPrice: {type: Number},
    shippingCost: {type: Number},
    condition: String,
    category: String,
    size: String,
    color: String,
    material: String,
    pattern: String,
    image: {type: String, default:""},
    gender: String,
    shop: {type: Schema.Types.ObjectId, ref:"Shop"},
    user: {type: Schema.Types.ObjectId, ref:"User"}
  }
```



## Backend Routes

| HTTP Method | URL               | Request body    | Success Code | Error | Description                                                  |
| ----------- | ----------------- | --------------- | ------------ | ----- | ------------------------------------------------------------ |
| GET         | /auth/me          | N/A             | 200          | 404   | Returns user data from session storage, for react FE authentication. |
| POST        | /auth/signup      | {name,email,pw} | 201          | 404   | Sign up route to create a new user                           |
| POST        | /auth/login       | {name,pw}       | 200          | 401   | Log in route to log in the existing user                     |
| POST        | /auth/logout      | N/A             | 204          | 400   | Logout route. Destroys the current login session.            |
| GET         | /api/products     |                 | 200          | 500   | Show product                                                 |
| POST        | /api/products     | {req.body}      | 201          | 500   | Add Product                                                  |
| GET         | /api/products/:id | {id}            | 200          | 500   | Show specific product                                        |
| PUT         | /api/products/:id | {id}            | 200          | 500   | Change specific product                                      |
| DELETE      | /api/products/:id | {id}            | 202          | 500   | Delete specific product                                      |
| GET         | /api/shops        |                 |              |       | Get all shops                                                |
| POST        | /api/shops        | {req.body}      | 201          | 500   | Add Shop                                                     |
| GET         | /api/shops/:id    | {id}            | 200          | 500   | Show specific shop                                           |
| PUT         | /api/shops/:id    | {req.body}      | 200          | 500   | Change specific shop                                         |
| DELETE      | /api/shops/:id    | {id}            | 201          | 500   | Delete specific shop                                         |

## Links

[Slides]: https://docs.google.com/presentation/d/1XL9FYXRnRsAAE7L6eLz6Pt7VIMgrBf-oxTk69Zr9Vsw/edit#slide=id.p

Git: 



