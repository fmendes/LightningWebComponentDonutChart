/* eslint-disable no-console */
/* eslint-disable vars-on-top */
import { LightningElement, api } from 'lwc';

export default class DonutChart extends LightningElement {
    @api chartWidth = '';
    @api displayLabels;
    @api displayValues;
    @api number;
    @api label;
    @api labels;
    @api values;
    listOfValues;
    listOfLabels;
    listOfChartElements;
    valueSectorOffset;

    connectedCallback() {
        var i = 0;
        var total = 0;
        var elem;
        var colorIndex;
        var colorPaletteList = [
            'grey'
            , 'blue', 'red', 'orange'
            , 'yellow', 'yellowgreen', 'green'
            , 'cyan', 'lightblue', 'purple'
            , 'magenta','saddlebrown', 'pink'
            , 'peachpuff', 'beige', 'palegreen'
            , 'lavender', 'tan', 'olive'
            , 'teal' ];

        // if labels are disabled, display values more to the right
        this.valueSectorOffset = "-2em";
        if( this.displayLabels === false ) {
            this.valueSectorOffset = "1.5em";
        }

        this.listOfValues = this.values.split( "," );
        this.listOfLabels = this.labels.split( "," );

        this.listOfChartElements = [];
        for( i = 0; i < this.listOfValues.length; i++ ) {
            total = total + parseFloat( this.listOfValues[ i ] );

            colorIndex = ( i + 1 ) % 20 + parseInt( ( i + 1 ) / 20, 10 );

            elem = { name: 'elem' + i 
                    , label: this.listOfLabels[ i ]
                    , value: parseFloat( this.listOfValues[ i ] )
                    , color: colorPaletteList[ colorIndex ]
                    , legendY:  0.3 + i * 3
                    , legendTextY: 1.8 + i * 3 };

            this.listOfChartElements.push( elem );
        }

        // eslint-disable-next-line no-console
        console.log( total );

        // calculate percentages and offsets
        var runningTotalOffset = 0.00;
        var runningAngle = 0.00;
        var fullCircle = 2 * Math.PI;
        var value = 0.00;
        var percent = 0.00;
        var offset = 0.00;
        var angle = 0.00;
        var labelXposition = 0.00;

        for( i = 0; i < this.listOfChartElements.length; i++ ) {
            elem = this.listOfChartElements[ i ];
            value = 100 * elem.value / total;
            percent = value.toFixed( 2 );
            elem.percent = percent;
            elem.percentExpression = percent + " " + (100 - percent);

            offset = 100 - runningTotalOffset + 25;
            if( i === 0 ) {
                offset = 25;
            }
            elem.offset = offset;

            // calculate position of label according to the section
            var tempVal = parseFloat( runningAngle ) 
                            + parseFloat( percent );
            runningAngle = tempVal;
            //console.log( elem.label );
            //console.log( 'runAngle ', tempVal );
            angle = fullCircle * ( runningAngle - percent / 2 ) / 100;
            //console.log( ' percent ', percent );
            //console.log( ' angle ', angle );
            
            // reposition label further to the left if on the left side
            labelXposition = 21 + 20 * Math.sin( angle );
            if( labelXposition < 21 ) {
                labelXposition = labelXposition - 5;
            }

            elem.labelXposition = labelXposition;
            elem.labelYposition = 21 - 20 * Math.cos( angle );
            
            runningTotalOffset = parseFloat( runningTotalOffset ) 
                                + parseFloat( percent );
            //console.log( ' runningTotalOffset ', runningTotalOffset );
        }

        console.log( this.listOfChartElements );
    }

}