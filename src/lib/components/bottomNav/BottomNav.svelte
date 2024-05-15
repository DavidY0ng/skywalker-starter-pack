<script lang='ts'>
	import Icon from "@iconify/svelte";
    import { page } from "$app/stores";
    
    const menuList = [ 
        {
            name: "Home",
            icon: "material-symbols:home",
            path: "/"
        },
        {
            name: "Bots",
            icon: "mage:chart-fill",
            path: "/bots"
        },
        {
            name: "User",
            icon: "mdi:user",
            path: "/user"
        },
    
    ]
</script>

<div class="fixed bottom-0 flex justify-between w-full px-5 py-2">
    {#each menuList as menu}
        <a href={menu.path} class="flex flex-col items-center text-sm {$page.url.pathname == menu.path ? 'text-primary-500' : 'text-gray-500'}">
            <div>
                <Icon icon={menu.icon} width="1.2em" height="1.2em" />
            </div>
            <div>
                {menu.name}
            </div>
        </a>
    {/each}
</div>
