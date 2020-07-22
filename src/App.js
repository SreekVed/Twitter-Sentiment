import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import CanvasJSReact from './canvasjs.react';
import './App.css';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.SubmitText = this.SubmitText.bind(this);
    this.SubmitTwitter = this.SubmitTwitter.bind(this);
    this.state = {
      visibility: 'hidden',
      title: '',
      sentiments: [],
      mode: '',
      spinner: 'hidden',
      color: ''
    }
    this.text = React.createRef();
    this.twitter = React.createRef();
  }

  SubmitTwitter(event) {
    event.preventDefault();
    if (this.twitter.current.value === '') return;
    this.setState({ visibility: 'hidden', title: 'Live Twitter Analysis for #' + this.twitter.current.value, spinner: 'visible', mode: 'text', color: 'twitter' });
    fetch('/api/twitter', {
      headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      },
      method: 'POST',
      cache: "no-cache",
      body: JSON.stringify(this.twitter.current.value)
    }).then(response => response.json()).then(data => this.setState({ sentiments: data, visibility: 'visible', spinner: 'hidden', mode: 'twitter' }));
    this.twitter.current.value = '';
  }

  SubmitText(event) {
    event.preventDefault();
    if (this.text.current.value === '') return;
    this.setState({ visibility: 'hidden', title: 'Text Analysis for "' + this.text.current.value + '"', spinner: 'visible', mode: 'text', color: 'text' });
    fetch('/api/text', {
      headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      },
      method: 'POST',
      cache: "no-cache",
      body: JSON.stringify(this.text.current.value)
    }).then(response => response.json()).then(data => this.setState({ sentiments: data, visibility: 'visible', spinner: 'hidden' }));
    this.text.current.value = '';
  }

  render() {
    return (
      <React.Fragment>

        <br/>
        <br/>

        <Form onSubmit={this.SubmitTwitter}>
          <Form.Group>
            <Form.Label><p id="form">Analyze Twitter Sentiment</p></Form.Label>
            <Form.Control size="lg" ref={this.twitter} type="text" placeholder="Enter keyword" />
            <br/><Button as="input" size="lg" type="submit" value="Submit" />{' '}
          </Form.Group>
        </Form>

        <Form onSubmit={this.SubmitText}>
          <Form.Group>
            <br/><Form.Label><p id="form">Analyze Text Sentiment</p></Form.Label>
            <Form.Control size="lg" ref={this.text} type="text" placeholder="Enter text" />
            <br/><Button as="input" variant="success" size="lg" type="submit" value="Submit" />{' '}
          </Form.Group>
        </Form>

        <Card bg={this.state.color === 'twitter' ? "primary" : "success"} style={{ visibility: this.state.spinner }}>
          <Card.Body><Spinner animation="border" variant="light" /></Card.Body>
        </Card>

        <div style={{ visibility: this.state.visibility }}>

          <CanvasJSChart options={{
            exportEnabled: true,
            animationEnabled: true,
            theme: "dark2",
            backgroundColor: this.state.mode === 'twitter' ? "#1da1f2" : "seagreen",
            subtitles: [{
              text: this.state.sentiments ? '' : 'No tweets found',
              verticalAlign: "center",
              fontSize: 30,
              dockInsidePlotArea: true
            }],
            title: {
              text: this.state.title,
              padding: 20
            },
            data: [{
              type: "pie",
              indexLabelFontWeight: "bold",
              indexLabelLineThickness: 4,
              startAngle: 0,
              toolTipContent: "{label} : {y}%",
              indexLabel: "{label} : {y}%",
              dataPoints: this.state.sentiments ? [
                { y: Math.round(this.state.sentiments[this.state.mode === 'twitter' ? 37 : 0] * 100), label: "Positive", color: 'lime' },
                { y: Math.round(this.state.sentiments[this.state.mode === 'twitter' ? 38 : 1] * 100), label: "Neutral", color: 'dimgray' },
                { y: Math.round(this.state.sentiments[this.state.mode === 'twitter' ? 39 : 2] * 100), label: "Negative", color: 'red' }
              ] : 0
            }]
          }} />

        </div>

        <br/>
        <br/>
        <br/>

        <div style={{ visibility: this.state.mode === 'twitter' ? 'visible' : 'hidden' }}>

          <CanvasJSChart options={{
            animationEnabled: true,
            theme: "dark2",
            title: {
              text: "Historical Sentiment",
              padding: 20
            },
            axisY: {
              includeZero: true,
              viewportMinimum: 0,
              viewportMaximum: 100,
              gridThickness: this.state.sentiments ? 1 : 0
            },
            toolTip: {
              shared: true,
              content: "{name} : {y}%",
              fontWeight: "bold",
              borderColor: "black"
            },
            subtitles: [{
              text: this.state.sentiments ? '' : 'No tweets found',
              verticalAlign: "center",
              fontSize: 30,
              dockInsidePlotArea: true
            }],
            data: [{
              type: "spline",
              name: "Positive",
              color: 'lime',
              lineThickness: 3,
              showInLegend: true,
              dataPoints: this.state.sentiments ? [
                { y: Math.round(this.state.sentiments[1] * 100), label: this.state.sentiments[0] },
                { y: Math.round(this.state.sentiments[5] * 100), label: this.state.sentiments[4] },
                { y: Math.round(this.state.sentiments[9] * 100), label: this.state.sentiments[8] },
                { y: Math.round(this.state.sentiments[13] * 100), label: this.state.sentiments[12] },
                { y: Math.round(this.state.sentiments[17] * 100), label: this.state.sentiments[16] },
                { y: Math.round(this.state.sentiments[21] * 100), label: this.state.sentiments[20] },
                { y: Math.round(this.state.sentiments[25] * 100), label: this.state.sentiments[24] },
                { y: Math.round(this.state.sentiments[29] * 100), label: this.state.sentiments[28] },
                { y: Math.round(this.state.sentiments[33] * 100), label: this.state.sentiments[32] },
                { y: Math.round(this.state.sentiments[37] * 100), label: this.state.sentiments[36] }
              ] : 0
            },
            {
              type: "spline",
              name: "Neutral",
              color: 'black',
              lineThickness: 3,
              showInLegend: true,
              dataPoints: this.state.sentiments ? [
                { y: Math.round(this.state.sentiments[2] * 100), label: this.state.sentiments[0] },
                { y: Math.round(this.state.sentiments[6] * 100), label: this.state.sentiments[4] },
                { y: Math.round(this.state.sentiments[10] * 100), label: this.state.sentiments[8] },
                { y: Math.round(this.state.sentiments[14] * 100), label: this.state.sentiments[12] },
                { y: Math.round(this.state.sentiments[18] * 100), label: this.state.sentiments[16] },
                { y: Math.round(this.state.sentiments[22] * 100), label: this.state.sentiments[20] },
                { y: Math.round(this.state.sentiments[26] * 100), label: this.state.sentiments[24] },
                { y: Math.round(this.state.sentiments[30] * 100), label: this.state.sentiments[28] },
                { y: Math.round(this.state.sentiments[34] * 100), label: this.state.sentiments[32] },
                { y: Math.round(this.state.sentiments[38] * 100), label: this.state.sentiments[36] }
              ] : 0
            },
            {
              type: "spline",
              name: "Negative",
              color: 'red',
              lineThickness: 3,
              showInLegend: true,
              dataPoints: this.state.sentiments ? [
                { y: Math.round(this.state.sentiments[3] * 100), label: this.state.sentiments[0] },
                { y: Math.round(this.state.sentiments[7] * 100), label: this.state.sentiments[4] },
                { y: Math.round(this.state.sentiments[11] * 100), label: this.state.sentiments[8] },
                { y: Math.round(this.state.sentiments[15] * 100), label: this.state.sentiments[12] },
                { y: Math.round(this.state.sentiments[19] * 100), label: this.state.sentiments[16] },
                { y: Math.round(this.state.sentiments[23] * 100), label: this.state.sentiments[20] },
                { y: Math.round(this.state.sentiments[27] * 100), label: this.state.sentiments[24] },
                { y: Math.round(this.state.sentiments[31] * 100), label: this.state.sentiments[28] },
                { y: Math.round(this.state.sentiments[35] * 100), label: this.state.sentiments[32] },
                { y: Math.round(this.state.sentiments[39] * 100), label: this.state.sentiments[36] }
              ] : 0
            }]
          }} />

        </div>
        <br/>
        <p>© Sreekar Vedula</p>

      </React.Fragment>
    );
  }
}

export default App;