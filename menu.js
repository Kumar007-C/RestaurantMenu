const express = require('express');
const { isRef } = require('joi');
const Joi = require('joi');
const app = express();
app.use(express.json());

//dummy data
const menu=[
    {item:'Plain Rice', price:'65', id:1},
    {item:'Jeera Rice', price:'95', id:2},
    {item:'Veg Biryani', price:'135', id:3},
    {item:'Paneer Biryani', price:'235', id:4},
    {item:'Plain Daal', price:'95', id:5},
    {item:'Daal Tadka', price:'155', id:6},
    {item:'Daal Makhani', price:'205', id:7},
    {item:'Paneer Butter Masala', price:'295', id:8},

];

//Read reqeust handlers
app.get('/', (req,res)=>{
    res.send('Welcome to the Dummy Hotel Menu');
});

app.get('/api/menu', (req,res)=>{
    res.send(menu);
});


app.get('/api/menu/:id', (req,res)=>{
    const item = menu.find(m=>m.id===parseInt(req.params.id));
    // if there is no valid menu item, then display an error with following message
    if(!item) res.status(404).send('<h2> Ooops... Can\'t find what you are looking for !! </h2>');
    res.send(item);
});

//Create menu item
app.post('/api/menu', (req, res)=>{
    const {error}=validateItem(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    // incement the item ID
    const ids = menu.map(object => {
        return object.id;
      });
      const maxId = Math.max.apply(null, ids);
    const menuItem={
    id: maxId+1,
    item: req.body.item,
    price: req.body.price
    };
    menu.push(menuItem);
    res.send(menuItem);
});

//Update request handler
//Update existing menu Itemm
app.put('/api/menu/:id',(req,res)=>{
    
    const item = menu.find(mi=>mi.id===parseInt(req.params.id));
    if(!item) res.status(404).send('<h2> Ooops... Can\'t find what you are looking for !!</h2>');
    const {error}=validateItem(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const  index= menu.indexOf(item);
    menu[index].item=req.body.item;
    menu[index].price=req.body.price;
    res.send(item);
});

//Delete menu Item details
app.delete('/api/menu/:id',(req,res)=>{
    const item = menu.find(mi=>mi.id===parseInt(req.params.id));
    if(!item) res.status(404).send('<h2 style="font-family:Malgun-Gothic; color: darkred"> Ooops... Can\'t find what you are looking for !!</h2>');
    const  index= menu.indexOf(item);
    menu.splice(index,1);
    res.send(item);
});

// validate information
function validateItem(menuItem){
    // return true;
    const schema = Joi.object({
        item: Joi.string()
            // .alphanum()
            .min(3)
            .max(30)
            .required(),
    
        price: Joi.number()
            // .pattern(new RegExp('^\d+(,\d{1,2})?$')),
    });
    return schema.validate(menuItem);
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));

//set DEBUG=express:* & node menu.js