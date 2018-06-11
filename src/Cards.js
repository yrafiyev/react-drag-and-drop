import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import Card from './Card';
import HTML5Backend from 'react-dnd-html5-backend';
import './Cards.css';

class Cards extends React.Component<> {

  constructor(props){
    super(props);
    this.state = {cards: []};
    for(let i = 0; i < 24; i++){
      this.state.cards = [...this.state.cards, {id: i, content: i} ];
    }
  }

  moveCard = (dragIndex: number, hoverIndex: number) => {
    const {cards} = this.state;
    const dragCard = cards[dragIndex];
    if(hoverIndex < dragIndex) {
      cards.splice(dragIndex, 1);
      cards.splice(hoverIndex, 0, dragCard);
    }
    else{
      cards.splice(hoverIndex + 1, 0, dragCard);
      cards.splice(dragIndex, 1);
    }
    this.setState({cards});
  }

  render() {
    const {cards} = this.state;

    return (
      <div style={{
        'display': 'flex',
        'flex-wrap': 'wrap',
        'height': '100%',
        'width': '100%'
      }}>
        {cards.map((card, i) =>
          this.renderCard(card.id, i)
        )}
      </div>
      );
  };

  renderCard(key: number, index: number){
    return (
      <div key={key} className="cards__card">
        <Card id={key} index={index} moveCard={this.moveCard}/>
      </div>
    );
  }
}


export default DragDropContext(HTML5Backend)(Cards);
