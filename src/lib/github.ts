interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface RepoStats {
  stars: number;
  contributors: number;
  contributorProfiles: Contributor[];
}

export async function fetchRepoStats(
  owner: string = 'idee8',
  repo: string = 'ShipFree',
): Promise<RepoStats> {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  try {
    // Fetch repository data (includes star count)
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
    );
    const repoData = await repoResponse.json();

    // Fetch contributors with their profiles
    const contributorsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      { headers },
    );
    const contributorsData = await contributorsResponse.json();

    const contributors = Array.isArray(contributorsData)
      ? contributorsData
      : [];
    const topContributors = contributors.slice(0, 8).map((contributor) => ({
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      contributions: contributor.contributions,
    }));

    return {
      stars: repoData.stargazers_count,
      contributors: contributors.length,
      contributorProfiles: topContributors,
    };
  } catch (error) {
    console.error('Error fetching repository stats:', error);
    return {
      stars: 0,
      contributors: 0,
      contributorProfiles: [],
    };
  }
}
