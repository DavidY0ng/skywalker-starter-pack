<script lang='ts'>
    import "../app.css";
    import Toast from "$lib/components/toasts/toast.svelte";
    import { initializeStores, Modal, Drawer, type ModalComponent } from '@skeletonlabs/skeleton';
    import BottomNav from "$lib/components/bottomNav/BottomNav.svelte";
    initializeStores();


</script>


<Toast />
<Drawer />
<div class="max-w-[425px] mx-auto">
    <div class="w-full">

        <slot />
        <BottomNav />
    </div>
</div>
  