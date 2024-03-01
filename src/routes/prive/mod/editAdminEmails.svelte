<script>
    import { _getDoc, _query, _updateDoc } from "$utils/firebase/firestore/basics";
    import { arrayRemove, arrayUnion } from "firebase/firestore";
    let adminEmails = []
    let modEmails = []
    const run = async()=>{
        const ref = await _getDoc('admin', 'admin')
        adminEmails = ref.data().adminEmails
        const q = await _query('users', 'mod', '==', true)
        for (const user of q) {
            modEmails = [...modEmails, user.data().email]
        }
        console.log(modEmails);
    }
    run()

    const deleteEmail = async (email)=>{
        await _updateDoc({adminEmails: arrayRemove(email)}, 'admin', 'admin')
        location.reload() 
    }
    const addEmail = async (email)=>{
        await _updateDoc({adminEmails: arrayUnion(email)}, 'admin', 'admin')
        location.reload() 
    }
</script>
<h1>
    Qui valide les certif medicaux ?
</h1>

A chaque envoie de certificat médical, un email sera envoyé à toutes les adresses ci-dessous. 
<br><br>
<ul>
    {#each adminEmails as email}
        <li>
            {email} <a href="#" on:click={()=>deleteEmail(email)}>🗑️</a>
        </li>
    {/each}
</ul>
<br><br>
<h4>Ajouter un moderateur à cette liste</h4>
<ul>
    {#each modEmails as email}
        <li>
            <a href="#" on:click={()=>addEmail(email)}>
                {email}
            </a>
        </li>
    {/each}
</ul>