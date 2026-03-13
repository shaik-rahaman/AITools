import { Candidate } from '../../types/search.types';
interface KnowledgeResultsListProps {
    candidates: Candidate[];
    isLoading?: boolean;
    onSelectCandidate?: (candidate: Candidate) => void;
}
export default function KnowledgeResultsList({ candidates, isLoading, onSelectCandidate, }: KnowledgeResultsListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=KnowledgeResultsList.d.ts.map