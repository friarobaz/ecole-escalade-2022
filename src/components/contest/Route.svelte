<script>
    /*
    The route object needs to have this format:
        {
            color: 'Rose',
            grade: '6a',
            id 'fsdkljfhsdf'
            lineNb: 4,
            lineTxt: 'dièdre'
        }
    */
    import { COLORS } from '$utils/colors'
    
    export let selectedRoute, route
    export let faded = false
    let background, background2, text

    $:if(route){
        background = COLORS.filter(x=>x.name==route.color)[0].background
        background2 = COLORS.filter(x=>x.name==route.color)[0].background2
        text = COLORS.filter(x=>x.name==route.color)[0].text
    }

    const handleClick = ()=>{
            if (selectedRoute == route) {
                selectedRoute = undefined
            } else {
                selectedRoute = route
            }
    }

</script>

<span class={selectedRoute==route ? "container selected" : "container"}>
    <a href="#" role="button"
    class={faded?'route faded':'route'}
    style="
    background-image:repeating-linear-gradient({background},{background2 || background}, {background});
    color: {text}; 
    border: 1px solid {background=='white'?'black':background}"
    on:click={handleClick}>
        {route.grade}
    </a>
</span>

<style>
    .route{
        padding: 15px;
        border: none;
        font-weight: bold;
        max-width: 300px;
        min-width: 200px;
    }

    .faded{
        opacity: 0.3;
    }
    .faded:hover{
        opacity: 1;
    }

    .container{
        border: 0px solid purple;
    }
    
    .selected a{
        text-decoration:underline;

    }
</style>