import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
import DatabaseIcon from '@tabler/icons-svelte/icons/database';
import FileWordIcon from '@tabler/icons-svelte/icons/file-word';
import FolderIcon from '@tabler/icons-svelte/icons/folder';
import HelpIcon from '@tabler/icons-svelte/icons/help';
import ListDetailsIcon from '@tabler/icons-svelte/icons/list-details';
import ReportIcon from '@tabler/icons-svelte/icons/report';
import SearchIcon from '@tabler/icons-svelte/icons/search';
import SettingsIcon from '@tabler/icons-svelte/icons/settings';
import UsersIcon from '@tabler/icons-svelte/icons/users';
import type { Icon } from '@tabler/icons-svelte';

export interface SidebarConfig {
	navMain: Array<{
		title: string;
		url: string;
		icon: Icon;
	}>;
	navSecondary: Array<{
		title: string;
		url: string;
		icon: Icon;
	}>;
	documents: Array<{
		name: string;
		url: string;
		icon: Icon;
	}>;
}

export const sidebarConfig: SidebarConfig = {
	navMain: [
		{
			title: '支付看板',
			url: '/dashboard',
			icon: DashboardIcon
		}
		// {
		// 	title: 'Lifecycle',
		// 	url: '#',
		// 	icon: ListDetailsIcon
		// },
		// {
		// 	title: 'Analytics',
		// 	url: '#',
		// 	icon: ChartBarIcon
		// },
		// {
		// 	title: 'Projects',
		// 	url: '#',
		// 	icon: FolderIcon
		// },
		// {
		// 	title: 'Team',
		// 	url: '#',
		// 	icon: UsersIcon
		// }
	],
	navSecondary: [
		{
			title: '设置',
			url: '#',
			icon: SettingsIcon
		},
		{
			title: '获取帮助',
			url: '#',
			icon: HelpIcon
		}
		// {
		// 	title: 'Search',
		// 	url: '#',
		// 	icon: SearchIcon
		// }
	],
	documents: [
		// 	{
		// 		name: 'Data Library',
		// 		url: '#',
		// 		icon: DatabaseIcon
		// 	},
		// 	{
		// 		name: 'Reports',
		// 		url: '#',
		// 		icon: ReportIcon
		// 	},
		// 	{
		// 		name: 'Word Assistant',
		// 		url: '#',
		// 		icon: FileWordIcon
		// 	}
	]
};
