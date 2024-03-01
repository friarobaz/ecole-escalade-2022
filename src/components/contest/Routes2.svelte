<script>
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
    import {releventRuns, studentCategory} from '$utils/contest'
    import Route from '$components/contest/Route.svelte'
    import Route2 from '$components/contest/Route2.svelte'
    import RouteMenu from '$components/contest/RouteMenu.svelte'
    import RouteCategories from './RouteCategories.svelte';
    export let routes, selectedRoute, event, categories, student

    const studentHasDoneThisRoute = (student, route, categories)=>{
        const category = studentCategory(student, categories)
        const runs = releventRuns(category, route.id)
        const studentsWhoHaveDoneThisRoute = runs.map(x=>x.student)
        return studentsWhoHaveDoneThisRoute.includes(student.id)
    }

    function compare( a, b ) {
    if ( a.grade < b.grade ){
        return -1;
    }
    if ( a.grade > b.grade ){
        return 1;
    }
    return 0;
    }

   
</script>



{#each routes.sort(compare)  as route}
    <li>
        {#if student && categories}
            
            <Route2 {route} bind:selectedRoute={selectedRoute} {event} {categories} done={studentHasDoneThisRoute(student, route, categories)}/>
            
        {:else}
            <Route2 {route} bind:selectedRoute={selectedRoute} {event} {categories} />
        {/if}
    </li>
{/each}



<style>
    li{
        list-style: none;
    }
    ul{
        padding: 0;
    }
</style>