import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import List from './newList';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: this.props.inventory,
      name: '',
      type: '',
      ID: '' ,
      model: '',
      price: 1000000,
      shipping: 0,
      UPC: '',
      manufacturer: '',
      image: '',
      description: '',
      url: ''
    }
  }
//Api Request
  getApiInfo(e) {
    e.preventDefault();
    axios.get('http://localhost:3030/products?$select[]=name&$select[]=id&$select[]=model&$select[]=description&$select[]=image&$select[]=url&$select[]=price&$select[]=shipping&$sort[price]=-1&$limit=12')
    .then((response) => {
      var newInventory = response.data.data.slice(0);
      this.setState({
        inventory: newInventory
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

//Search Function
  onFormSubmit(e) {
    e.preventDefault();
    let inventory
    let newItem = {
      name: this.state.name,
      type: 'typeHere',
      id: this.state.id,
      model: this.state.model,
      price: 1000000,
      shipping: 0,
      upc: 'upcHere',
      manufacturer: this.state.manufacturer,
      image: this.state.image,
      description: this.state.description,
      url: this.state.url
      };
  axios.post('http://localhost:3030/products', newItem).then((added) => {
    axios.get('http://localhost:3030/products?$sort[price]=-1').then((response) => {
      inventory = response.data.data
      this.setState({inventory})
      })
    })
  }
  whenChanged(field, e) {
      var change = {};
      change[field] = e.target.value;
      this.setState(change);
    }

//Delete Function
  onDeleteClick(id, e) {
    e.preventDefault();
    var confirmed = confirm("Are you sure you want to delete this this for good?")
    if (confirmed === true){
      console.log('http://localhost:3030/products/'+id)
      axios.delete('http://localhost:3030/products/'+id).then((response) => {
        this.getApiInfo(e)
      })
    } else {
      console.log("your item has been deleted")
    }

  }
  render() {
    if (this.state.inventory.length === 0) {
      return false
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>"BB API of Fun"</h2>
        </div>
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <input onChange={this.whenChanged.bind(this, 'name')} type='text' value={this.state.name} placeholder='product name'/>
          <input onChange={this.whenChanged.bind(this, 'type')} type='text' value={this.state.type} placeholder='product type'/>
          <input onChange={this.whenChanged.bind(this, 'ID')} type='text' value={this.state.id} placeholder='product ID'/>
          <input onChange={this.whenChanged.bind(this, 'price')} type='number' min="10000" value={this.state.price} placeholder='price'/>
          <input onChange={this.whenChanged.bind(this, 'shipping')} type='text' value={this.state.shipping} placeholder='shipping cost'/>
          <input onChange={this.whenChanged.bind(this, 'UPC')} type='text' value={this.state.upc} placeholder='product UPC'/>
          <input onChange={this.whenChanged.bind(this, 'description')} type='text' value={this.state.description} placeholder='description'/>
          <input onChange={this.whenChanged.bind(this, 'manufacturer')} type='text' value={this.state.manufacturer} placeholder='manufacturer'/>
          <input onChange={this.whenChanged.bind(this, 'model')} type='text' value={this.state.model} placeholder='model'/>
          <input onChange={this.whenChanged.bind(this, 'url')} type='text' value={this.state.url} placeholder='product url'/>
          <input onChange={this.whenChanged.bind(this, 'image')} type='text' value={this.state.image} placeholder='image url'/>

          <button>Add me!</button>
        </form>
        <p className="App-intro">
          Stuff
        </p>
        <List
          inventory={this.state.inventory}
          getApiInfo={this.getApiInfo.bind(this)}
          onDeleteClick={this.onDeleteClick.bind(this)}
        />
      </div>
    );
  }
}

export default App;
