const branches = [
	{
		label: 'v4 (stable)',
		version: '4.x',
		aliases: ['4','stable'],
	},
	{
		label: 'v3',
		version: '3.x',
		aliases: ['3'],
	},
	{
		label: 'v2',
		version: '2.x',
		aliases: ['2'],
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