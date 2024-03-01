<script>
    import Routes2 from "./Routes2.svelte";
    import Route from "./Route.svelte";
    import Route2 from "./Route2.svelte";

    /*
    routes need to have this format:
    {
        color: 'Rose',
        grade: '6a',
        id 'fsdkljfhsdf'
        lineNb: 4,
        lineTxt: 'dièdre'
    }
    */
    export let routes, selectedRoute, event, categories, student
    export let showMulticolor = true

    export const removeDuplicates = (array)=>{
        array = array.filter(
            (value, index, self) => index === self.findIndex(
                (t) => (t.lineNb === value.lineNb)
                )
            )
        return array
    }
    const lines = removeDuplicates(routes).map(x=>{return {nb:x.lineNb, txt:x.lineTxt}})
    lines.sort((a, b) => {return a.nb - b.nb})

</script>

<ul>
    {#each lines as line}
        <li>
            <hgroup>
                <h4>Ligne {line.nb} </h4>
                <h5 class="cap">{line.txt}</h5>
            </hgroup>
            <ul>
                <Routes2 routes={routes.filter(x=>x.lineNb==line.nb)} bind:selectedRoute={selectedRoute} {event} {categories} {student}/>
                {#if showMulticolor}
                    <li><Route2 route={{color:'Toutes prises', grade:'TP', id:`TP_${line.nb}`, lineNb:line.nb, lineTxt:line.txt}} bind:selectedRoute={selectedRoute} {event} {categories} {student}/></li>
                {/if}
            </ul>
                
           
        </li>
    {/each}
</ul>


<style>
    ul li{
        list-style: none;
    }
    ul{
        padding: 0;
    }

    h4{
        margin-bottom:15px;
        margin-top:30px;
    }

    h5.cap{
        text-transform: capitalize;
    }
</style>