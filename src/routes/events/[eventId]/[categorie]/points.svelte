<script>
    import { _getDoc, _query } from '$utils/firebase/firestore/basics'
    import { doc, onSnapshot } from "firebase/firestore"
    import { db } from "$utils/firebase/firebase"
    import { pointsWithStudents, nbOfRuns} from '$utils/contest'
    import {printName} from '$utils/printName'
    import {params} from '@roxi/routify'
    const catId = $params.categorie
    const eventId = $params.eventId
    
    let loading, category, points

    const getPoints = async () =>{
        loading = true
        category = await _getDoc('events', eventId, 'categories', catId)
        points = pointsWithStudents(category, 1000)
        loading = false
     }

     const unsub = onSnapshot(doc(db, "events", eventId, 'categories', catId), () => {
        getPoints()
    })

</script>


{#if category}
    <h1>{category.data().title}</h1>
{/if}

{#if loading}
    <div aria-busy="true"></div>
{:else}
    {#if points}
        <ol>
            {#each points as point}
                <li>
                    <ul>
                        {#each  point.students as student}
                            <li>
                                <a href="./{student.id}">
                                    {printName(student, category.data().students)}
                                    &nbsp;&nbsp;
                                    <small>
                                        ({Math.floor(point.points)} points, {nbOfRuns(category, student.id)} voie{#if nbOfRuns(category, student.id) > 1}s
                                        {/if}
                                        )
                                    </small>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </li>
            {/each}
        </ol>
    {/if}
{/if}


<style>
    ul li{
        list-style: none;
    }
</style>