import Image from 'next/image';
import Link from 'next/link';

import { Github } from '../icons';
import { fetchRepoStats } from '@/lib/github';
import { ButtonLink } from '../ui/button-link';

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

export async function OpenSourseStats() {
  const { contributors, stars, contributorProfiles } = await fetchRepoStats();

  return (
    <div className="relative mx-auto mt-8 w-full max-w-screen-lg overflow-hidden sm:rounded-2xl rounded-lg  p-6 text-center sm:p-12 sm:px-0">
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-3xl">Proudly open-source</h2>
        <p className="max-w-lg text-center text-neutral-300">
          Our source code is available on GitHub - feel free to read, review, or
          contribute to it however you want!
        </p>
        <ButtonLink
          href={'https://github.com/idee8/mentor.ai'}
          variant={'outline'}
        >
          <Github />
          Star on Github
        </ButtonLink>
      </div>
      <div className="container mx-auto px-4 my-6">
        <div className="flex flex-col md:flex-row justify-center items-center border-t border-border">
          <div className="w-full md:w-1/2 p-6 text-center border-b md:border-b-0 md:border-r border-border">
            <div className="flex justify-center mb-4">
              <div className="relative h-24 w-40 group cursor-pointer">
                <div className="absolute left-0 top-4">
                  <StarIcon className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition-transform duration-100" />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <StarIcon className="w-14 h-14 text-yellow-400 group-hover:scale-110 transition-transform duration-100" />
                </div>
                <div className="absolute right-0 top-4">
                  <StarIcon className="w-10 h-10 text-yellow-400 group-hover:scale-110 transition-transform duration-100" />
                </div>
              </div>
            </div>
            <h3 className="text-base font-medium text-foreground">
              {formatNumber(stars)} Stars
            </h3>
          </div>

          <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 text-center">
            <div className="flex justify-center mb-4 max-w-52">
              <Link
                href={'https://github.com/idee8/mentor.ai/graphs/contributors'}
                className="flex flex-wrap justify-center gap-2 max-w-xs"
              >
                {contributorProfiles.map((contributor) => (
                  <div
                    key={contributor.login}
                    className="relative h-10 w-10 block size-8 overflow-hidden rounded-full bg-gray-200 transition-transform duration-100 hover:scale-110"
                  >
                    <Image
                      src={contributor.avatar_url}
                      alt={`Contributor ${contributor.html_url}`}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </Link>
            </div>
            <h3 className="text-base font-medium text-foreground">
              {formatNumber(contributors)}+ Contributors
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);
