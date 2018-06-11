import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {
	DragSource,
	DropTarget,
	ConnectDropTarget,
	ConnectDragSource,
	DropTargetMonitor,
	DropTargetConnector,
	DragSourceConnector,
	DragSourceMonitor,
} from 'react-dnd';
import './Card.css';
import ItemTypes from './ItemTypes';
import { XYCoord } from 'dnd-core';

const cardSource = {
	beginDrag(props: CardProps) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props: CardProps, monitor: DropTargetMonitor, component: Card) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = (findDOMNode(
			component,
		)).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Get horizontal middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = (clientOffset).y - hoverBoundingRect.top;
    const hoverClientX = (clientOffset).x - hoverBoundingRect.left;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%
		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && hoverClientX > hoverMiddleX) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY && hoverClientX < hoverMiddleX) {
			return;
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	},
}

export interface CardProps {
	id: any,
	index: number,
	isDragging?: boolean,
	connectDragSource?: ConnectDragSource,
	connectDropTarget?: ConnectDropTarget,
	moveCard: (dragIndex: number, hoverIndex: number) => void
}



export class Card extends React.Component<>{
  render() {

    const {
      id,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props;
		const opacity = isDragging ? 0 : 1

    const card = (
      <div className="Card" style={{
        'border-style': isDragging ? 'solid' : 'none',
        'box-shadow': isDragging ? 0 : '0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1)',
      }}>
        <div style={{
          'opacity': opacity
        }}>
          <div className="LoadingOverlay" style={{width: '100%', height: '120px', 'marginTop': '24px', 'marginBottom': '8px'}}>

          </div>
          <div className="LoadingOverlay" style={{width: '100%', height: '50px', 'marginTop': '8px', 'marginBottom': '8px'}}>
          </div>
          <div className="LoadingOverlay" style={{width: '100%', height: '40px', 'marginTop': '8px', 'marginBottom': '8px'}}>
          </div>
        </div>
      </div>
    );

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(card)
      )
    );
  }
}


Card.propTypes = {
  connectDragSource: PropTypes.func.isRequire,
  connectDropTarget: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.any.isRequired,
  moveCard: PropTypes.func.isRequired,
};

const targetCard = DropTarget(ItemTypes.CARD, cardTarget, (connect: DropTargetConnector) => ({
	connectDropTarget: connect.dropTarget(),
}))(Card);

export default DragSource(
	ItemTypes.CARD,
	cardSource,
	(connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}),
)(targetCard);
