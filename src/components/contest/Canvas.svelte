<script>
    import { onMount } from 'svelte';
    import {COLORS} from '$utils/colors'
    export let scores
    let max
    let canvas, ctx
    const CANVAS_HEIGHT = window.innerHeight -20
    const CANVAS_WIDTH = window.innerWidth - 50
    const LABEL_HEIGHT = 30
    let GAP = 5
    let FONT_SIZE = {grade:20, score:15, line:18, runs:10}

    function removeDuplicates(arr) {
        return arr.filter((item,index) => arr.indexOf(item) === index);
    }

    $:if(scores && canvas){
        max = Math.max(...scores.map(x=>x.potential))
        ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw()
    }

    const draw = ()=>{
        canvas.width = CANVAS_WIDTH
        canvas.height = CANVAS_HEIGHT
        ctx = canvas.getContext("2d")
        let x = 0
        const originY = CANVAS_HEIGHT- LABEL_HEIGHT - 5
        let lines = removeDuplicates(scores.map(x=>x.lineNb));
        lines.sort(function(a, b) {
        return a - b;
        });

        let routeWidth = (CANVAS_WIDTH-GAP*(lines.length-1))/scores.length

        const gradient = (route)=>{
            // Create gradient
            const background = COLORS.filter(x=>x.name===route.color)[0].background
            const background2 = COLORS.filter(x=>x.name===route.color)[0].background2 || background
            var grd = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                const nbOfStripes = 50
                for (let i = 0; i < nbOfStripes; i++) {
                    if (i%2) {
                        grd.addColorStop(i/nbOfStripes, background);
                    }else{
                        
                        grd.addColorStop(i/nbOfStripes, background2 );
                    }
                }
                return grd
        }

        

        for (const line of lines) {
            const releventRoutes = scores.filter(x=>x.lineNb === line)
            ctx.fillStyle = 'black'
            ctx.fillRect(x, CANVAS_HEIGHT, routeWidth*releventRoutes.length, -LABEL_HEIGHT)
            ctx.fillStyle = 'white'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = `${FONT_SIZE.line}px sans-serif`
            ctx.fillText(line, x+(routeWidth*releventRoutes.length)/2, originY+LABEL_HEIGHT/2+5)

            for (const route of releventRoutes) {
                //let routeHeight = -route.potential*(CANVAS_HEIGHT-12)/(max+GAP)-(max-route.potential)/10
                let routeHeight = -originY*route.potential/max
                const grd = gradient(route)
                ctx.fillStyle = grd
                ctx.fillRect(x, originY, routeWidth, routeHeight)
                
                //contour
                if (["Blanche", "Saumon", "Bleue marbrée", "Verte marbrée", "Rouge marbrée", "Toutes prises"].includes(route.color)) {
                    ctx.rect(x, originY, routeWidth, routeHeight)
                }
                //text
                ctx.fillStyle = COLORS.filter(x=>x.name===route.color)[0].text;
                
                ctx.font = `${FONT_SIZE.grade}px sans-serif`
                if (route.grade != 'TP') {
                    
                    ctx.fillText(route.grade, x+routeWidth/2, originY-20)
                }
                ctx.font = `${FONT_SIZE.score}px sans-serif`
                ctx.fillText(Math.floor(route.potential), x+routeWidth/2, originY+routeHeight+25)
                ctx.font = `${FONT_SIZE.runs}px sans-serif`
                ctx.fillText(`(${route.sends})`, x+routeWidth/2, originY+routeHeight+45)
                x += routeWidth
            }
            x+=GAP
        }
        ctx.stroke();
    }

    onMount(() => {
        draw()
    })

    

</script>

<canvas bind:this={canvas}></canvas>
<br>
Gap:
<input type="range" min=0 max=50 bind:value={GAP} style="width: 200px;" on:change={draw}>{GAP}


Grade:
<input type="range" min=0 max=50 bind:value={FONT_SIZE.grade} style="width: 200px;" on:change={draw}>{FONT_SIZE.grade}

score:
<input type="range" min=0 max=50 bind:value={FONT_SIZE.score} style="width: 200px;" on:change={draw}>{FONT_SIZE.score}

line:
<input type="range" min=0 max=50 bind:value={FONT_SIZE.line} style="width: 200px;" on:change={draw}>{FONT_SIZE.line}

runs:
<input type="range" min=0 max=50 bind:value={FONT_SIZE.runs} style="width: 200px;" on:change={draw}>{FONT_SIZE.runs}

<style>

    canvas{
        border: 0px solid red;
        margin: 10px;
        background-color: white;

    }


</style>