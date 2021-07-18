const branches = [
	{
		label: 'v5 (stable)',
		version: '5.x',
		aliases: ['5','stable'],
	},
	{
		label: 'v4',
		version: '4.x',
		aliases: ['4'],
	},
];

const [defaultBranch] = branches;

export default {
	data() {
		return {
			branches,
			defaultBranch,
			selectedBranch: defaultBranch.version,
		};
	},
	mounted() {
		this.selectedBranch = localStorage.getItem('branch-version') || defaultBranch.version;
	},
	methods: {
		getBranch(version) {
			return this.branches.find(branch => branch.aliases.includes(version) || branch.version === version);
		},
		updateBranch(branch) {
			this.selectedBranch = branch;
		},
	},
};