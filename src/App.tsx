import React from "react";
import "./App.css";
import AddNewProductToCartForm from "./components/Cart/AddNewProductToCartForm";
import Orders from "./components/Cart/Orders";

function App() {

    return (
        <div className="App">
            <AddNewProductToCartForm/>
            <Orders/>
        </div>
    );
}

export default App;
