import React, { Component, Fragment } from 'react'
import axios from 'axios'
import ReactHtmlParser from 'react-html-parser';


class Home extends Component {
    constructor(props) {
        super(props);
        this.searchRef = React.createRef();
        this.optionRef = React.createRef();
        this.state = { 
            event : [],
            options : [],
            city : [],
            value : '',
            search : false,
            searchEv : [],            
        }
    }
    
    componentDidMount(){// au chargement de la page
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPos);
          }
        // requete pour avoir les evenement dans un perimetre de 50km
        axios.get(`http://api.eventful.com/rest/events/search?app_key=WdwsKtNbRr4ZvPRk&where=${localStorage.getItem('latitude')},${localStorage.getItem('longitude')}&within=25`)
        .then(reponse =>{
            var convert = require('xml-js');
            var result2 = convert.xml2js(reponse.data, {compact: true, spaces: 4});
            console.log(result2.search.events.event)
            this.setState({event : result2.search.events.event})
            })
          axios.get('http://api.eventful.com/rest/categories/list?app_key=WdwsKtNbRr4ZvPRk')
            .then(reponse =>{
                var convert = require('xml-js');
                var result2 = convert.xml2js(reponse.data, {compact: true, spaces: 4});
                this.setState({options : result2.categories.category})
            })
    }
    showPos = (position)=>{
        this.setState({pos : position})
        localStorage.setItem('latitude',position.coords.latitude)// stockage latitude/longitude dans le localstorage
        localStorage.setItem('longitude',position.coords.longitude)
    }

    searchHandle = (e) =>{
        if(this.searchRef.current.value !== '' && this.optionRef.current.value !== 'All'){// recherche par categorie
             axios.get(`http://api.eventful.com/rest/events/search?app_key=WdwsKtNbRr4ZvPRk&keywords=${this.optionRef.current.value}&location=${this.searchRef.current.value}&date=Future`)
                .then((reponse =>{
                    var convert = require('xml-js');
                    var result2 = convert.xml2js(reponse.data, {compact: true, spaces: 4});
                    if(result2.search.total_items._text !== '0'){
                        const result = result2.search.events.event.map((event) => (
                            <div key={event._attributes.id} className="event-wrap">
                                <div className="event-img">
                                    { event.image.url ? <img  alt={'event_img'} src={event.image.url._text} /> : <p>no img</p> }
                                </div>
                                <div className="event-info">
                                    <h2>{event.title._text}</h2>
                                        <p>{ReactHtmlParser(event.description._text)}</p>
                                    <br />
                                    <button>En savoir +</button>
                                </div>
                            </div>
                        ))
                        this.setState({searchEv : result})
                        this.setState({ search : true })
                    }
                }))
            
        }else if(this.optionRef.current.value === 'All' && this.searchRef.current.value !== ''){
             axios.get(`http://api.eventful.com/rest/events/search?app_key=WdwsKtNbRr4ZvPRk&location=${this.searchRef.current.value}&date=Future`)
                .then((reponse =>{
                    var convert = require('xml-js');
                    var result2 = convert.xml2js(reponse.data, {compact: true, spaces: 4});
                    if(result2.search.total_items._text !== '0'){
                        const result = result2.search.events.event.map((event) => (
                            <div key={event._attributes.id} className="event-wrap">
                                <div className="event-img">
                                    { event.image.url ? <img alt={'event_img'} src={event.image.url._text} /> : <p>no img</p> }
                                </div>
                                <div className="event-info">
                                    <h2>{event.title._text}</h2>
                                        <p>{ReactHtmlParser(event.description._text)}</p>
                                    <br />
                                    <button>En savoir +</button>
                                </div>
                            </div>
                        ))
                            this.setState({searchEv : result})
                            this.setState({ search : true })
                    }
                }))
            
        }else if(this.optionRef.current.value !== 'All' && this.searchRef.current.value === ''){

             axios.get(`http://api.eventful.com/rest/events/search?app_key=WdwsKtNbRr4ZvPRk&keywords=${this.optionRef.current.value}&location=${localStorage.getItem('latitude')},${localStorage.getItem('longitude')}&within=25`)
                .then((reponse =>{
                    var convert = require('xml-js');
                    var result2 = convert.xml2js(reponse.data, {compact: true, spaces: 4});
                    if(result2.search.total_items._text !== '0'){
                        const result = result2.search.events.event.map((event) => (
                            <div key={event._attributes.id} className="event-wrap">
                                <div className="event-img">
                                    { event.image.url ? <img alt={'event_img'} src={event.image.url._text} /> : <p>no img</p> }
                                </div>
                                <div className="event-info">
                                    <h2>{event.title._text}</h2>
                                        <p>{ReactHtmlParser(event.description._text)}</p>
                                    <br />
                                    <button>En savoir +</button>
                                </div>
                            </div>
                        ))
                        this.setState({searchEv : result})
                        this.setState({ search : true })
                    }
                }))
        }else if(this.optionRef.current.value === 'All' && this.searchRef.current.value === ''){
            this.setState({ search : false })
        }
    
        
    }

    render() {
        
        const events = this.state.event.map((event) => ( //affichage des events
            <div key={event._attributes.id} className="event-wrap">
                <div className="event-img">
                    { event.image.url ? <img alt={'event_img'} src={event.image.url._text} /> : <p>no img</p> }
                </div>
                <div className="event-info">
                    <h2>{event.title._text}</h2>
                        <p>{ReactHtmlParser(event.description._text)}</p>
                    <br />
                    <button onClick={()=>this.handleEventInfo(event)}>En savoir +</button>
                </div>
            </div>
        ))
        const options = this.state.options.map((option, index) =>(
            <option key={option.id._text}>{option.id._text}</option>
        ))
        
        return (
            <Fragment>
            <div className="header">
                <button>LOGIN</button>
            </div>
            <div className="body-wrap">
                <div className="body-search">
                    <div className="input-search">
                        <label>ville</label>
                        <input ref={this.searchRef} placeholder='Ville'></input>
                    </div>
                    <div className="input-search">
                        <label>catégorie</label>
                        <select ref={this.optionRef}>
                            <option>All</option>
                            {options}
                        </select>
                    </div>
                    <button onClick={this.searchHandle}>Filter</button>
                </div>
                <div className="body-display">
                    {this.state.search ? this.state.searchEv : events}
                </div>
            </div>
            </Fragment>
        );
    }
}
 
export default Home;