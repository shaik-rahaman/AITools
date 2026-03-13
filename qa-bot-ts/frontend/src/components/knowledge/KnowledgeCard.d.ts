import { Candidate } from '../../types/search.types';
interface KnowledgeCardProps {
    candidate: Candidate;
    rank: number;
    onSelect?: (candidate: Candidate) => void;
}
export default function KnowledgeCard({ candidate, rank, onSelect, }: KnowledgeCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=KnowledgeCard.d.ts.map